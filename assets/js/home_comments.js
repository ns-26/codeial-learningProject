//method to submit the form data for new post using Ajax
let createComment = function() {
	let newCommentForm = $('#new-comment-form');
	newCommentForm.submit(function(e) {
		e.preventDefault();

		$.ajax({
			type: 'post',
			url: '/comments/create',
			data: newCommentForm.serialize(),
			success: function(data) {
				let newComment = newCommentDom(data.data.comment);
				$(`#post-comments-${data.data.comment.post}`).prepend(newComment);
				deleteComment($(' .delete-comment-button', newComment));

				new Noty({
					theme: 'relax',
					text: 'Comment published!',
					type: 'success',
					layout: 'topRight',
					timeout: 1500
				}).show();

				console.log(data.data.comment);
			},
			error: function(error) {
				console.log(error.responseText);
			}
		});
	});
};
//method to create a post in DOM

let newCommentDom = function(comment) {
	return $(`<li id="comment-${comment._id}">
        <p>
            <small><a href="/comments/destroy/${comment._id}" class="delete-comment-button">X</a></small>
            ${comment.content}
            <br>
			<small>${comment.user.name}</small>
			<br>
			<small><a href="/likes/toggle/?id=${comment._id}&type="Comment">${comment.likes.length} Likes</a></small>
        </p>
    </li>`);
};

//method to delete post from dom
let deleteComment = function(deleteLink) {
	$(deleteLink).click(function(e) {
		e.preventDefault();
		$.ajax({
			type: 'get',
			url: $(deleteLink).prop('href'),
			success: function(data) {
				$(`#comment-${data.data.comment_id}`).remove();

				new Noty({
					theme: 'relax',
					text: 'Comment Deleted',
					type: 'success',
					layout: 'topRight',
					timeout: 1500
				}).show();

				console.log(data);
			},
			error: function(error) {
				console.log(error.responseText);
			}
		});
	});
};

createComment();
let deleteCommentButton = $('.delete-comment-button');
for (button of deleteCommentButton) {
	deleteComment(button);
}
